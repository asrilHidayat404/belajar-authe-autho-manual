import { useEffect, useState } from 'react';

interface Prop {
    text: string;
    delay: number;
}

const TypeEffect = ({ text, delay }: Prop) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex >= text.length) return;

        const timeout = setTimeout(() => {
            setCurrentText((prevText) => prevText + text[currentIndex]);
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);

        return () => clearTimeout(timeout);
    }, [currentIndex, delay, text]);

    return <p className="text-center text-3xl font-bold " > {currentText} </p>;
};

export default TypeEffect;