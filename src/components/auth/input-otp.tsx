"use client";

import { useState } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    disabled?: boolean;
}

export const OTPInput = ({
    length = 6,
    onComplete,
    disabled,
}: OTPInputProps) => {
    const [value, setValue] = useState("");

    const handleChange = (val: string) => {
        setValue(val);

        if (val.length === length) {
            onComplete(val);
        }
    };

    return (
        <InputOTP
            maxLength={length}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className="flex gap-3 justify-center"
        >
            <InputOTPGroup className="flex gap-3">
                {Array.from({ length }).map((_, i) => (
                    <InputOTPSlot
                        key={i}
                        index={i}
                        className={`w-12 h-14 text-center text-2xl font-semibold border rounded-lg transition-all data-[active=true]:ring-2 data-[active=true]:ring-primary data-[active=true]:scale-105 data-[filled=true]:bg-primary/5 data-[filled=true]:border-primary`}
                    />
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
};
