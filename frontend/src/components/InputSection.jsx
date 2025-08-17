import React, { useRef, useState } from "react";
import { BASE_URL } from '../utils/API'

const InputSection = () => {
    const [transcript, setTranscript] = useState("");
    const [prompt, setPrompt] = useState("");
    const [summary, setSummary] = useState("");
    const [emails, setEmails] = useState("");
    const fileRef = useRef(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState(false);


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setTranscript(event.target.result);
        };
        reader.readAsText(file);
    };

    const generateSummary = async () => {
        if (!transcript) {
            alert("Please upload file or paste transcript.")
        }
        setLoadingSummary(true);
        try {
            const formData = new FormData();
            const fileInput = fileRef.current
            if (fileInput.files.length > 0) {
                formData.append("file", fileInput.files[0]);
            }
            else {
                formData.append("transcript", transcript);
            }
            formData.append("prompt", prompt);

            const response = await fetch(`${BASE_URL}/summarize`, {
                method: "POST",
                body: formData
            })
            const data = await response.json();
            if (data.success) {
                setSummary(data.summary);
            } else {
                alert("Failed to generate summary: " + data.error);
            }
        } catch (error) {
            console.error("Error generating summary:", error);
            alert("Something went wrong while generating summary");
        }
        finally {
            setLoadingSummary(false);
        }
    }

    const sendEmail = async () => {
        if (!summary) {
            alert("No summary to send!");
            return;
        }
        if (!emails) {
            alert("Please enter recipient emails!");
            return;
        }
        setLoadingEmail(true);
        try {
            const formattedEmails = emails.split(",").map(e => e.trim()).join(",");
            const response = await fetch(`${BASE_URL}/send-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emails: formattedEmails,
                    summary: summary
                })
            })
            const data = await response.json();

            if (data.success) {
                alert("Email sent successfully!");
            } else {
                alert("Failed to send email: " + data.error);
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Something went wrong.");
        }
        finally{
            setLoadingEmail(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white w-full flex justify-center items-start py-10">
            <div className="w-4xl bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6 border border-slate-700">
                <div>
                    <label className="block mb-3 text-sky-300 font-medium">
                        Upload Transcript
                    </label>
                    <input
                        type="file"
                        ref={fileRef}
                        id="fileUpload"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden" />
                    <label
                        htmlFor="fileUpload"
                        className="cursor-pointer bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium">
                        Choose File
                    </label>

                    {transcript && (
                        <p className="mt-2 text-sky-300 text-sm truncate">
                            File uploaded
                        </p>
                    )}
                </div>

                {/* Transcript Textarea */}
                <div className="w-full">
                    <label className="block mb-2 text-sky-300 font-medium">
                        Or Paste Transcript
                    </label>
                    <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        rows="4"
                        placeholder="Paste transcript here..."
                        className="w-full bg-slate-700 border border-sky-500 rounded outline-none p-3 text-white" />
                </div>

                {/* Prompt */}
                <div>
                    <label className="block mb-2 text-sky-300 font-medium">
                        Custom Prompt
                    </label>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Summarize in bullet points for executives"
                        className="w-full bg-slate-700 border border-sky-500 rounded outline-none p-3 text-white" />
                </div>

                {/* Generate Button */}
                <button
                    onClick={() => generateSummary()}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white outline-none font-semibold py-2 px-4 rounded-lg"
                    disabled={loadingSummary} >
                    {loadingSummary ? "Generating..." : "Generate Summary"}
                </button>

                {/* Editable Summary */}
                <div>
                    <label className="block mb-2 text-sky-300 font-medium">
                        Summary
                    </label>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows="6"
                        placeholder="Generated summary will appear here..."
                        className="w-full bg-slate-700 border border-sky-500 outline-none rounded p-3 text-white" />
                </div>

                {/* Emails */}
                <div>
                    <label className="block mb-2 text-sky-300 font-medium">
                        Recipient Emails
                    </label>
                    <input
                        type="text"
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                        placeholder="example1@mail.com, example2@mail.com"
                        className="w-full bg-slate-700 border border-sky-500 rounded outline-none p-3 text-white" />
                </div>

                {/* Send Button */}
                <button
                    onClick={() => sendEmail()}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg"
                    disabled={loadingEmail}>
                    {loadingEmail ? "Sending..." : "Send Email"}
                </button>
            </div>
        </div>
    );
};

export default InputSection
