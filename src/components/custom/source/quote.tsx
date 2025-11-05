"use client"

import { IUserProps } from "@/utils/interfaces";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface IQuoteProps {
    user: IUserProps
}

export default function Quote({ user }: IQuoteProps): React.ReactElement {
    const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [quote, setQuote] = useState<string | null>(null);

    const handleGetQuote = useCallback(async () => {
        setQuoteLoading(true);
        setQuoteError(null);

        try {
            const response = await axios.post(`/api/quote/${user.id}`);
            if (response.status === 201) {
                setQuote(response.data.quote);
            }
        } catch (error) {
            console.error('error while generating quote: ', error);
            setQuoteError('something went wrong. please try again.');
        } finally {
            setQuoteLoading(false);
        };
    }, [user.id]);

    useEffect(() => {
        handleGetQuote();
    }, [handleGetQuote]);

    return (
        <div className="w-full flex flex-col gap-2 px-4 py-4 border-[0.3px] dark:border-gray-800 rounded-md border-gray-100">
            <div className="w-full flex justify-start font-bold text-lg dark:text-yellow-500">Quote of the day!</div>
            {quoteLoading ? (
                <div className="w-full py-2 flex flex-row gap-2 justify-center items-center">
                    <span className="loader" />
                </div>
            ) : quoteError ? (
                <div className="w-full flex justify-center items-center">
                    <p className="text-red-400 tracking-tighter font-medium">
                        {quoteError}
                    </p>
                </div>
             ) : (
                <div className="w-full">
                    <p className="tracking-tigher  dark:text-yellow-500 text-black">{`"${quote}"`}</p>
                </div>
             )}
        </div>
    )
}