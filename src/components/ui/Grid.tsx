interface Props {
    className?: string;
    children?: any;
}

export default function Grid({ className, children }: Props) {
    return (
        <>
            <div className={`grid ${className}`}>
                {children}
            </div>
        </>
    )
}