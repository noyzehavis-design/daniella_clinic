"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaCheck } from "react-icons/fa";
import GlowButton from "@/app/components/ui/GlowButton";
import { siteContent } from "@/app/lib/content";

const formSchema = z.object({
  fullName: z.string().min(1, "שדה חובה"),
  phone: z
    .string()
    .regex(/^(05\d{8}|077\d{7})$/, "מספר טלפון לא תקין (לדוגמה: 0521234567)"),
  serviceType: z.string().min(1, "יש לבחור שירות"),
});
type FormData = z.infer<typeof formSchema>;

const inputClass = (hasError?: boolean) =>
  `w-full border-[1.5px] rounded-xl px-4 py-[14px] outline-none transition-all duration-200
   bg-lightBg text-textDark placeholder:text-textSecondary
   ${
     hasError
       ? "border-red-400"
       : "border-[#E2E8F0] focus:border-primary focus:shadow-[0_0_0_3px_var(--primary-glow)]"
   }`;

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-textDark/70">{label}</label>
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
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (_data: FormData) => {
    setSubmitted(true);
  };

  return (
    <section className="bg-lightBg py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* LEFT column — service info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full mb-4">
              {siteContent.service.tag}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              {siteContent.service.heading}
            </h2>
            <p className="text-textDark/70 mb-6 leading-relaxed">
              {siteContent.service.description}
            </p>

            <ul className="space-y-3 mb-8">
              {siteContent.service.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={bulletVariants}
                  className="flex items-center gap-3 border-l-[3px] border-primary bg-white shadow-sm rounded-xl p-4"
                >
                  <FaCheck className="text-primary flex-shrink-0" />
                  <span className="text-textDark/80">{b}</span>
                </motion.li>
              ))}
            </ul>

            <div
              className="relative w-full aspect-[4/3] overflow-hidden"
              style={{ borderRadius: "32px", boxShadow: "0 25px 60px rgba(74,191,191,0.2)" }}
            >
              <Image
                src={siteContent.service.image}
                alt={siteContent.service.heading}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* RIGHT column — sticky form card */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              id="inline-form"
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="bg-white p-8"
              style={{
                borderRadius: "32px",
                border: "1px solid rgba(74,191,191,0.2)",
                boxShadow:
                  "0 20px 60px rgba(74,191,191,0.1), 0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary-glow)" }}
                  >
                    <FaCheck className="text-primary text-2xl" />
                  </motion.div>
                  <p className="text-dark font-bold text-lg">
                    {siteContent.forms.successMessage}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-dark mb-6 text-center">
                    {siteContent.forms.inlineTitle}
                  </h3>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                  >
                    <Field label="שם מלא">
                      <input
                        type="text"
                        {...register("fullName")}
                        className={inputClass(!!errors.fullName)}
                        placeholder="שם מלא"
                      />
                      <ErrorMsg msg={errors.fullName?.message} />
                    </Field>
                    <Field label="טלפון">
                      <input
                        type="tel"
                        {...register("phone")}
                        className={inputClass(!!errors.phone)}
                        placeholder="05XXXXXXXX"
                      />
                      <ErrorMsg msg={errors.phone?.message} />
                    </Field>
                    <Field label="סוג שירות">
                      <select
                        {...register("serviceType")}
                        className={inputClass(!!errors.serviceType)}
                        style={{ appearance: "none" }}
                      >
                        <option value="">בחרי שירות</option>
                        {siteContent.forms.serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ErrorMsg msg={errors.serviceType?.message} />
                    </Field>
                    <GlowButton fullWidth size="lg">
                      {isSubmitting ? "שולח..." : siteContent.forms.submitText}
                    </GlowButton>
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
