import {useEffect, useRef} from "react";

export default function usePrev<T>(value: T) {
    const prevRef = useRef<T>();
    useEffect(() => {
        prevRef.current = value;
    })

    return {
        value: prevRef.current,
        // осторожно, если value в будущем будет вручную присвоено undefined
        isValChanged: (prevRef.current !== undefined) && (prevRef.current !== value)
    };
 }