"use client";
import { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaCheck } from "react-icons/fa";
import GlowButton from "@/app/components/ui/GlowButton";
import { useContent } from "@/app/lib/ContentContext";

const inputClass = (hasError?: boolean) =>
  `w-full border-[1.5px] rounded-xl px-4 py-[14px] outline-none transition-all duration-200
   bg-white text-base text-[#0F1923] placeholder:text-slate-400
   ${
     hasError
       ? "border-red-400"
       : "border-[#E2E8F0] focus:border-[#4ABFBF] focus:shadow-[0_0_0_3px_rgba(74,191,191,0.15)]"
   }`;

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-400 text-xs mt-1">{msg}</p> : null;

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-[#0F1923]/70">{label}</label>
    {children}
  </div>
);

const bulletVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function ServiceFormSection() {
  const { content } = useContent();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const req = content.forms?.requiredFields;
  const formSchema = useMemo(() => z.object({
    fullName: req?.name !== false ? z.string().min(1, "שדה חובה") : z.string(),
    phone: req?.phone !== false
      ? z.string().regex(/^(05\d{8}|077\d{7})$/, "מספר טלפון לא תקין")
      : z.string(),
    serviceType: req?.service !== false ? z.string().min(1, "יש לבחור שירות") : z.string(),
  }), [req?.name, req?.phone, req?.service]);
  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data: FormData) => {
    setSubmitError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          phone: data.phone,
          serviceType: data.serviceType,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    }
  };

  return (
    <section className="bg-[#F8FFFE] py-16 md:py-24">

      <div className="max-w-7xl mx-auto px-4">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 items-start"
        >
          {/* Child 1 — Image (desktop: col1 row1; mobile: first) */}
          <motion.div
            className="lg:col-start-2 lg:row-start-1"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="relative w-full aspect-[4/3] overflow-hidden"
              style={{ borderRadius: "32px", boxShadow: "0 25px 60px rgba(74,191,191,0.2)" }}
            >
              <Image
                src={content.service.image}
                alt={content.service.heading}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Child 2 — Text content (desktop: col2 row1+2; mobile: second) */}
          <motion.div
            className="lg:col-start-1 lg:row-start-1"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full mb-4 text-center block">
              {content.service.tag}
            </span>
            <h2 style={{ fontSize: { sm: "clamp(1.5rem,3vw,2rem)", md: "clamp(2rem,5vw,3.5rem)", lg: "clamp(2.5rem,6vw,4.5rem)" }[(content.typography?.sectionHeadingSize ?? "md") as "sm"|"md"|"lg"] }} className="font-bold text-[#0F1923] mb-4 text-center">
              {content.service.heading}
            </h2>
            {content.service.description.includes("<") ? (
              <div className="text-[#0F1923]/70 mb-6 leading-relaxed text-center" dangerouslySetInnerHTML={{ __html: content.service.description }} />
            ) : (
              <p className="text-[#0F1923]/70 mb-6 leading-relaxed text-center">
                {content.service.description}
              </p>
            )}

            <ul className="space-y-3 mb-8">
              {content.service.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={bulletVariants}
                  className="flex items-center gap-3 rounded-2xl px-5 py-3.5 bg-primary/5 border border-primary/15"
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/20">
                    <FaCheck className="text-[#4ABFBF] text-xs" />
                  </span>
                  <span className="text-[#0F1923]/80 font-medium">{b}</span>
                </motion.li>
              ))}
            </ul>

            {/* Trust badge — Israel Orthodontic Society */}
            <div className="mt-8 inline-flex items-center gap-3 bg-primary rounded-xl px-4 py-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/80 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <Image
                src="/ortho-society.png"
                alt="האגודה האורתודונטית בישראל"
                width={100}
                height={32}
                className="h-8 w-auto object-contain flex-shrink-0"
              />
              <span className="text-sm font-semibold text-white">חברה באגודת האורתודונטים</span>
            </div>
          </motion.div>

          {/* Child 3 — Form (desktop: full-width row2; mobile: third) */}
          <div className="lg:col-span-2 lg:row-start-2">
            <motion.div
              id="inline-form"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="px-8 py-7"
              style={{
                borderRadius: "32px",
                background: "#ffffff",
                border: "1px solid rgba(74,191,191,0.35)",
                boxShadow: "0 20px 60px rgba(74,191,191,0.15), 0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ height: 4, borderRadius: "32px 32px 0 0", background: "linear-gradient(to left, #4ABFBF, #2D9E9E)", margin: "-32px -32px 24px -32px" }} />
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(74,191,191,0.2)" }}
                  >
                    <FaCheck className="text-primary text-2xl" />
                  </motion.div>
                  <p className="text-[#0F1923] font-bold text-lg">
                    {content.forms.successMessage}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[#0F1923] mb-6 text-center">
                    {content.forms.inlineTitle}
                  </h3>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    <div className="flex flex-col lg:flex-row lg:items-end lg:gap-5 gap-5">
                      <div className="lg:flex-1">
                        <Field label={content.forms.fieldName}>
                          <input
                            type="text"
                            {...register("fullName")}
                            className={inputClass(!!errors.fullName)}
                            placeholder={content.forms.fieldName}
                          />
                          <ErrorMsg msg={errors.fullName?.message} />
                        </Field>
                      </div>
                      <div className="lg:flex-1">
                        <Field label={content.forms.fieldPhone}>
                          <input
                            type="tel"
                            {...register("phone")}
                            className={inputClass(!!errors.phone)}
                            placeholder="05XXXXXXXX"
                          />
                          <ErrorMsg msg={errors.phone?.message} />
                        </Field>
                      </div>
                      <div className="lg:flex-1">
                        <Field label={content.forms.fieldService}>
                          <select
                            {...register("serviceType")}
                            className={inputClass(!!errors.serviceType)}
                            style={{ appearance: "none" }}
                          >
                            <option value="">בחרי שירות</option>
                            {content.forms.serviceOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ErrorMsg msg={errors.serviceType?.message} />
                        </Field>
                      </div>
                      <div className="lg:flex-shrink-0 lg:w-44">
                        <GlowButton fullWidth size="lg">
                          {isSubmitting ? "שולח..." : content.forms.submitText}
                        </GlowButton>
                      </div>
                    </div>
                    {submitError && (
                      <p className="text-red-400 text-sm text-center mt-3">
                        שגיאה בשליחה, נסי שוב מאוחר יותר
                      </p>
                    )}
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
