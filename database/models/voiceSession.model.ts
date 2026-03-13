import { IVoiceSession } from "@/types";
import { model, models, Schema, Types } from "mongoose";

const voiceSessionSchema = new Schema<IVoiceSession>(
  {
    clerkId: { type: String, required: true, index: true },
    bookId: { type: Types.ObjectId, required: true, ref: "Book" },
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date },
    durationSeconds: { type: Number, required: true, default: 0 },
    billingPeriodStart: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

voiceSessionSchema.index({ clerkId: 1, billingPeriodStart: 1 });

const VoiceSession =
  models.VoiceSession ||
  model<IVoiceSession>("VoiceSession", voiceSessionSchema);

export default VoiceSession;
