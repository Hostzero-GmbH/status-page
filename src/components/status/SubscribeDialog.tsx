import { useState } from "react";
import { Mail, MessageSquare, X, Bell } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type SubscriptionMethod = "email" | "sms";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

const smsSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .regex(/^\+?[1-9]\d{6,14}$/, {
      message: "Please enter a valid phone number (e.g., +1234567890)",
    }),
});

interface SubscribeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeDialog({ isOpen, onClose }: SubscribeDialogProps) {
  const [method, setMethod] = useState<SubscriptionMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (method === "email") {
        const result = emailSchema.safeParse({ email });
        if (!result.success) {
          setErrors({ email: result.error.errors[0].message });
          setIsSubmitting(false);
          return;
        }
        
        // In a real implementation, this would call an API
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        toast({
          title: "Subscribed!",
          description: `You'll receive status updates at ${email}`,
        });
        setEmail("");
      } else {
        const result = smsSchema.safeParse({ phone });
        if (!result.success) {
          setErrors({ phone: result.error.errors[0].message });
          setIsSubmitting(false);
          return;
        }
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        toast({
          title: "Subscribed!",
          description: `You'll receive SMS updates at ${phone}`,
        });
        setPhone("");
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg animate-fade-in rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Get status updates</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Sidebar tabs */}
          <div className="flex w-40 flex-shrink-0 flex-col gap-1 border-r border-border bg-muted/30 p-3">
            <button
              onClick={() => {
                setMethod("email");
                setErrors({});
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                method === "email"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
              )}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => {
                setMethod("sms");
                setErrors({});
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                method === "sms"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              SMS
            </button>
          </div>

          {/* Form area */}
          <form onSubmit={handleSubmit} className="flex-1 p-6">
            {method === "email" ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-status-maintenance"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={cn(
                      "w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground",
                      "placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-status-maintenance/50",
                      "transition-all",
                      errors.email ? "border-destructive" : "border-input"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll only email you when there are incidents or scheduled maintenance.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium text-status-maintenance"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    className={cn(
                      "w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground",
                      "placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-status-maintenance/50",
                      "transition-all",
                      errors.phone ? "border-destructive" : "border-input"
                    )}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Include your country code. Standard SMS rates may apply.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg bg-status-maintenance px-5 py-2.5",
                  "text-sm font-medium text-white transition-all",
                  "hover:bg-status-maintenance/90",
                  "focus:outline-none focus:ring-2 focus:ring-status-maintenance/50 focus:ring-offset-2 focus:ring-offset-card",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface SubscribeButtonProps {
  onClick: () => void;
}

export function SubscribeButton({ onClick }: SubscribeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2",
        "text-sm font-medium text-foreground transition-all",
        "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Bell className="h-4 w-4" />
      <span className="hidden sm:inline">Subscribe to Updates</span>
      <span className="sm:hidden">Subscribe</span>
    </button>
  );
}
