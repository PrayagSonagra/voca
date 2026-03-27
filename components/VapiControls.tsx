"use client"
import useVapi from '@/hooks/useVapi'
import { IBook } from '@/types'
import { Mic, MicOff } from 'lucide-react'
import Image from 'next/image'
import Transcript from '@/components/Transcript'

interface VapiControlsProps {
    book: IBook
}

const VapiControls = ({ book }: VapiControlsProps) => {

    const {
        status,
        messages,
        isActive,
        currentMessage,
        currentUserMessage,
        duration,
        limitError,
        // isBillingError,
        // maxDurationSeconds,
        start,
        stop,
        clearError,
    } = useVapi(book)

    return (

        <>

            <div className="vapi-header-card w-full mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
                    {/* Left: Book Cover & Mic Button */}
                    <div className="vapi-cover-wrapper">
                        <Image
                            src={book.coverURL}
                            alt={`Cover of ${book.title}`}
                            width={162}
                            height={240}
                            className="vapi-cover-image"
                        />
                        <div className="vapi-mic-wrapper relative">
                            {isActive && (status === 'speaking' || status === 'thinking') && (
                                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                            )}
                            <button
                                onClick={isActive ? stop : start}
                                disabled={status === 'connecting'}
                                className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                            >
                                {isActive ? (
                                    <Mic className="size-7 text-white" />
                                ) : (
                                    <MicOff className="size-7 text-[#212a3b]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right: Book Details & Badges */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-[#212a3b] font-serif">
                                {book.title}
                            </h1>
                            <p className="text-[#3d485e] text-lg mt-1">by {book.author}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="vapi-status-indicator shadow-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40">
                                <span className="vapi-status-dot vapi-status-dot-ready"></span>
                                <span className="vapi-status-text">Ready</span>
                            </div>

                            {book.persona && (
                                <div className="vapi-badge-ai shadow-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40">
                                    <span className="vapi-badge-ai-text">
                                        Voice: {book.persona}
                                    </span>
                                </div>
                            )}

                            <div className="vapi-badge-ai shadow-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40">
                                <span className="vapi-badge-ai-text">0:00/15:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="vapi-transcript-wrapper w-full">
                <Transcript
                    messages={messages}
                    currentMessage={currentMessage}
                    currentUserMessage={currentUserMessage}
                />
            </div>
        </>
    )
}

export default VapiControls