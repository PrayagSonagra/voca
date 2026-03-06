"use client";

import React, { useCallback, useRef, useState } from "react";
import { preventDoubleSpace, sanitiseOnPaste } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { UploadSchema, UploadFormValues } from "@/lib/zod";
import {
    Upload,
    Image as ImageIcon,
    X,
    FileText,
    Loader2,
} from "lucide-react";

// ─── Voice Definitions ────────────────────────────────────────────────────────
const MALE_VOICES = [
    { id: "dave", name: "Dave", description: "Young male, British-Essex, casual & conversational" },
    { id: "daniel", name: "Daniel", description: "Middle-aged male, British, authoritative but warm" },
    { id: "chris", name: "Chris", description: "Male, casual & easy-going" },
];

const FEMALE_VOICES = [
    { id: "rachel", name: "Rachel", description: "Young female, American, calm & clear" },
    { id: "sarah", name: "Sarah", description: "Young female, American, soft & approachable" },
];

// ─── Loading Overlay ─────────────────────────────────────────────────────────
function LoadingOverlay() {
    return (
        <div className="loading-wrapper">
            <div className="loading-shadow-wrapper bg-white shadow-soft-lg">
                <div className="loading-shadow">
                    <Loader2 className="loading-animation w-14 h-14 text-[#663820]" />
                    <p className="loading-title">Processing your book…</p>
                    <div className="loading-progress">
                        {["Uploading PDF", "Extracting text", "Generating cover", "Finalising"].map(
                            (step) => (
                                <div key={step} className="loading-progress-item gap-2">
                                    <span className="loading-progress-status" />
                                    <span className="text-(--text-secondary)">{step}</span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── File Dropzone ────────────────────────────────────────────────────────────
interface DropzoneProps {
    file: File | null | undefined;
    onFileChange: (file: File | null) => void;
    accept: string;
    icon: React.ReactNode;
    text: string;
    hint: string;
    disabled?: boolean;
}

function Dropzone({ file, onFileChange, accept, icon, text, hint, disabled }: DropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (!disabled) inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        onFileChange(selected);
        e.target.value = "";
    };

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (disabled) return;
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) onFileChange(dropped);
        },
        [disabled, onFileChange]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    return (
        <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`upload-dropzone border-2 border-dashed border-(--border-medium) ${file ? "upload-dropzone-uploaded" : ""
                } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
                disabled={disabled}
            />

            {file ? (
                <div className="flex flex-col items-center gap-2 px-4">
                    <FileText className="w-8 h-8 text-[#663820]" />
                    <span className="upload-dropzone-text text-sm text-center break-all">
                        {file.name}
                    </span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFileChange(null);
                        }}
                        className="upload-dropzone-remove mt-1"
                        disabled={disabled}
                    >
                        <X className="w-5 h-5" />
                        <span className="sr-only">Remove file</span>
                    </button>
                </div>
            ) : (
                <>
                    <div className="upload-dropzone-icon">{icon}</div>
                    <p className="upload-dropzone-text">{text}</p>
                    <p className="upload-dropzone-hint">{hint}</p>
                </>
            )}
        </div>
    );
}

// ─── Voice Card ───────────────────────────────────────────────────────────────
interface VoiceCardProps {
    id: string;
    name: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
    disabled?: boolean;
}

function VoiceCard({ id, name, description, selected, onSelect, disabled }: VoiceCardProps) {
    return (
        <div
            role="radio"
            aria-checked={selected}
            tabIndex={0}
            onClick={() => !disabled && onSelect()}
            onKeyDown={(e) => e.key === "Enter" && !disabled && onSelect()}
            className={`voice-selector-option flex-1 min-w-30 ${selected
                ? "voice-selector-option-selected"
                : "voice-selector-option-default"
                } ${disabled ? "voice-selector-option-disabled" : ""}`}
        >
            {/* Radio circle */}
            <span
                className={`w-4 h-4 min-w-4 rounded-full border-2 flex items-center justify-center transition-colors ${selected
                    ? "border-(--accent-warm) bg-(--accent-warm)"
                    : "border-(--border-medium) bg-white"
                    }`}
            >
                {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>

            <div className="flex flex-col gap-0.5">
                <span className="font-bold text-(--text-primary) text-sm">{name}</span>
                <span className="text-xs text-(--text-secondary) leading-4">{description}</span>
            </div>
        </div>
    );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
const UploadForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UploadFormValues>({
        resolver: zodResolver(UploadSchema),
        defaultValues: {
            pdf: undefined,
            coverImage: null,
            title: "",
            author: "",
            voice: "rachel",
        },
    });

    const onSubmit = async (values: UploadFormValues) => {
        setIsSubmitting(true);
        try {
            // TODO: wire up server action / API call
            console.log("Form values:", values);
            await new Promise((r) => setTimeout(r, 2000)); // placeholder
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isSubmitting && <LoadingOverlay />}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="new-book-wrapper space-y-8"
                >
                    {/* ── PDF Upload ─────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="pdf"
                        render={({ field }) => (
                            <FormItem>
                                <label className="form-label">Book PDF File</label>
                                <FormControl>
                                    <Dropzone
                                        file={field.value as File | null}
                                        onFileChange={(f) => field.onChange(f)}
                                        accept="application/pdf"
                                        icon={<Upload className="w-full h-full" />}
                                        text="Click to upload PDF"
                                        hint="PDF file (max 50MB)"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Cover Image Upload ─────────────────────── */}
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <label className="form-label">Cover Image (Optional)</label>
                                <FormControl>
                                    <Dropzone
                                        file={field.value as File | null}
                                        onFileChange={(f) => field.onChange(f)}
                                        accept="image/*"
                                        icon={<ImageIcon className="w-full h-full" />}
                                        text="Click to upload cover image"
                                        hint="Leave empty to auto-generate from PDF"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Title ─────────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <label className="form-label" htmlFor="title">
                                    Title
                                </label>
                                <FormControl>
                                    <input
                                        id="title"
                                        className="form-input border border-(--border-subtle) focus:outline-none focus:ring-2 focus:ring-(--accent-warm)/30 focus:border-(--accent-warm) transition-all"
                                        placeholder="ex: Rich Dad Poor Dad"
                                        disabled={isSubmitting}
                                        {...field}
                                        onKeyDown={preventDoubleSpace}
                                        onPaste={sanitiseOnPaste}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Author ────────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <label className="form-label" htmlFor="author">
                                    Author Name
                                </label>
                                <FormControl>
                                    <input
                                        id="author"
                                        className="form-input border border-(--border-subtle) focus:outline-none focus:ring-2 focus:ring-(--accent-warm)/30 focus:border-(--accent-warm) transition-all"
                                        placeholder="ex: Robert Kiyosaki"
                                        disabled={isSubmitting}
                                        {...field}
                                        onKeyDown={preventDoubleSpace}
                                        onPaste={sanitiseOnPaste}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Voice Selector ────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                            <FormItem>
                                <label className="form-label">Choose Assistant Voice</label>
                                <FormControl>
                                    <div className="flex flex-col gap-4">
                                        {/* Male voices */}
                                        <div>
                                            <p className="text-sm font-medium text-(--text-secondary) mb-2">
                                                Male Voices
                                            </p>
                                            <div className="voice-selector-options flex-wrap">
                                                {MALE_VOICES.map((v) => (
                                                    <VoiceCard
                                                        key={v.id}
                                                        {...v}
                                                        selected={field.value === v.id}
                                                        onSelect={() => field.onChange(v.id)}
                                                        disabled={isSubmitting}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Female voices */}
                                        <div>
                                            <p className="text-sm font-medium text-(--text-secondary) mb-2">
                                                Female Voices
                                            </p>
                                            <div className="voice-selector-options flex-wrap">
                                                {FEMALE_VOICES.map((v) => (
                                                    <VoiceCard
                                                        key={v.id}
                                                        {...v}
                                                        selected={field.value === v.id}
                                                        onSelect={() => field.onChange(v.id)}
                                                        disabled={isSubmitting}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Submit ────────────────────────────────── */}
                    <button type="submit" className="form-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Processing…" : "Begin Synthesis"}
                    </button>
                </form>
            </Form>
        </>
    );
};

export default UploadForm;