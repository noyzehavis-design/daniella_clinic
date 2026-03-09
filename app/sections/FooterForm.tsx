"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContent } from "@/app/lib/ContentContext";

const formSchema = z.object({
  fullName: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  phone: z
    .string()
    .regex(/^0[5-9]\d{8}$/, "מספר טלפון ישראלי לא תקין"),
  serviceType: z.string().min(1, "בחרי שירות"),
});
type FormData = z.infer<typeof formSchema>;

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:border-[#4ABFBF] focus:ring-[#4ABFBF]/40 text-base text-right";

export default function FooterForm() {
  const { content } = useContent();
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (_data: FormData) => {
    setSubmitted(true);
  };

  return (
    <section
      id="footer-form"
      dir="rtl"
      className="py-16 md:py-24"
      style={{ background: "linear-gradient(135deg, #4ABFBF 0%, #2D9E9E 100%)" }}
    >
      <motion.div
        ref={ref}
        className="max-w-lg mx-auto px-4 text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          {content.forms.footerTitle}
        </h2>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M8 20 L17 29 L32 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </svg>
            </div>
            <p className="text-xl font-semibold">{content.forms.successMessage}</p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div>
              <input
                type="text"
                {...register("fullName")}
                placeholder="שם מלא *"
                className={inputClass}
              />
              {errors.fullName && (
                <p className="text-white/80 text-sm text-right mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="tel"
                {...register("phone")}
                placeholder="טלפון *"
                className={inputClass}
              />
              {errors.phone && (
                <p className="text-white/80 text-sm text-right mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("serviceType")}
                className={inputClass}
                style={{ appearance: "none" }}
              >
                <option value="">בחרי שירות *</option>
                {content.forms.serviceOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="text-white/80 text-sm text-right mt-1">
                  {errors.serviceType.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-white text-[#2D9E9E] font-bold text-lg hover:bg-white/90 transition-colors shadow-lg mt-2 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? "שולח..." : content.forms.submitText}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
