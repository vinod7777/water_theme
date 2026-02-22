import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleAvishkaar from "./ParticleAvishkaar";
const avishkaarLanguages = [
    { text: "AVISHKAAR", language: "English" },
    { text: "आविष्कार", language: "Hindi" },
    { text: "ஆவிஷ்கார்", language: "Tamil" },
    { text: "ఆవిష్కార్", language: "Telugu" },
    { text: "আবিষ্কার", language: "Bengali" },
    { text: "ಆವಿಷ್ಕಾರ್", language: "Kannada" },
    { text: "ആവിഷ്കാർ", language: "Malayalam" },
    { text: "આવિષ્કાર", language: "Gujarati" },
    { text: "ਆਵਿਸ਼ਕਾਰ", language: "Punjabi" },
    { text: "ଆଭିଷ୍କାର", language: "Odia" },
    { text: "आविष्कार", language: "Marathi" },
];
const TypingEffect = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const currentWord = avishkaarLanguages[currentIndex].text;
    useEffect(() => {
        const handleTyping = () => {
            if (!isDeleting) {
                if (displayText.length < currentWord.length) {
                    setDisplayText(currentWord.slice(0, displayText.length + 1));
                }
                else {
                    setTimeout(() => setIsDeleting(true), 4000); // 4s Hold time requested
                    return;
                }
            }
            else {
                if (displayText.length > 0) {
                    setDisplayText(currentWord.slice(0, displayText.length - 1));
                }
                else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % avishkaarLanguages.length);
                }
            }
        };
        const baseSpeed = isDeleting ? 60 : 110; // Slower characters to fit 2s transformation cycle
        const jitter = Math.random() * 40 - 20;
        const timer = setTimeout(handleTyping, baseSpeed + jitter);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentWord]);
    return (<div className="flex flex-col items-center w-full">
        <div className="relative z-10 w-full h-[110px] md:h-[220px] flex items-center justify-center pointer-events-none">
            {/* The ParticleAvishkaar manages its own WebGL interaction entirely independently */}
            <ParticleAvishkaar text={displayText} />
        </div>

    </div>);
};
export default TypingEffect;
