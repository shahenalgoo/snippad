import { FC } from "react";
import { useUser } from "@/context/SessionContext";
import { useAuth } from "@/hooks";

import { Button, InputField, InputLabel } from "@/components";
import { TbArrowNarrowRight } from "react-icons/tb";
import toast from "react-hot-toast";

interface CreateAccountProps {

}

const CreateAccount: FC<CreateAccountProps> = () => {

    // Hooks
    //
    const { createAccount, createAccountForm, setCreateAccountForm, login } = useAuth();
    const { isLoading, setIsLoading } = useUser();


    // Handle state changes on form
    //
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreateAccountForm({ ...createAccountForm, [e.target.id]: e.target.value });
    }


    // Handle form submission
    //
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        toast.loading('Creating account...');

        try {
            await createAccount(createAccountForm.email, createAccountForm.password, createAccountForm.name);

            toast.dismiss();
            toast.success('Your account has been created!');

            // Login after account is created
            await (await login(createAccountForm.email, createAccountForm.password));

        } catch (error) {
            toast.dismiss();
            toast.error('Unable to create account.');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit}>

            <div className="mb-6">
                <InputLabel>Name</InputLabel>
                <InputField
                    id="name"
                    type='text'
                    defaultValue={createAccountForm.name}
                    onChange={onFieldChange}
                    disabled={isLoading}
                    className="text-sm disabled:opacity-50"
                />
            </div>

            <div className="mb-6">
                <InputLabel>Email Address</InputLabel>
                <InputField
                    id="email"
                    type='email'
                    defaultValue={createAccountForm.email}
                    onChange={onFieldChange}
                    disabled={isLoading}
                    className="text-sm disabled:opacity-50"
                />
            </div>

            <div className="mb-6">
                <InputLabel>Password</InputLabel>
                <InputField
                    id="password"
                    type='password'
                    defaultValue={createAccountForm.password}
                    onChange={onFieldChange}
                    disabled={isLoading}
                    className="text-sm disabled:opacity-50"
                />
            </div>

            <Button disabled={isLoading} type="submit" className="w-full">
                Create Account <TbArrowNarrowRight size={20} strokeWidth={1.5} className="ml-2" />
            </Button>

        </form>
    );
}

export default CreateAccount;