// React
import { MouseEventHandler } from "react";

// Components
import Button from "./Button";
import Box from "./Box";

// Icons
import { TbX } from "react-icons/tb";

// Utils
import { VariantProps, cva } from 'class-variance-authority';
import { overridableClasses } from '@/utils/override-classes';


const modalVariants = cva(
    'w-full ',
    {
        variants: {
            variant: {
                default: 'max-w-[500px] px-4',
                full: 'h-full max-w-[640px] py-6 px-4 md:px-0'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

export interface Props
    extends React.HTMLAttributes<HTMLElement | HTMLButtonElement>,
    VariantProps<typeof modalVariants> {

    modalActive?: any;
    onClose?: MouseEventHandler<HTMLDivElement | HTMLButtonElement>;

    title: string;
    customHeader?: any;
    closeButton?: boolean;
    closeWithBackdrop?: boolean;
}


export default function Modal({ className, variant, modalActive, onClose, closeWithBackdrop = true, children, closeButton = true, title, customHeader, ...props }: Props) {

    return modalActive ? (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center">
            <div className={overridableClasses(modalVariants({ className, variant }))} {...props}>
                <Box variant='white' className="relative z-50 w-full h-full shadow-xl overflow-hidden p-0">

                    {!customHeader &&
                        <div className="flex items-center justify-between p-4">
                            <h3 className="text-xl font-bold uppercase">{title}</h3>
                            {closeButton &&
                                <Button variant='black' size='square' onClick={onClose}>
                                    <TbX size={20} strokeWidth={1} />
                                </Button>
                            }
                        </div>
                    }

                    {customHeader}


                    <div className="h-[calc(100%_-_60px)] overflow-auto">
                        {children}
                    </div>

                </Box>

                <div onClick={closeWithBackdrop ? onClose : () => null} className="absolute top-0 left-0 -z-0 w-full h-full backdrop-blur-lg bg-black/30">&nbsp;</div>
            </div>
        </div>
    ) : null;

}