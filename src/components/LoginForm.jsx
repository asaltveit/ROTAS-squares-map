import { useForm } from "react-hook-form";
import { 
    Box,
    Button, 
    InputLabel,
    TextField, 
} from '@mui/material';

// Based on https://blog.stackademic.com/create-a-login-form-with-react-hook-form-package-ab1634a206c9

const LoginForm = ({ onSuccess }) => {
    /*
        - didn't put in test account
        isCapitalLetter: (value) =>
            /[A-Z]/.test(value) ||
            "Password should have at least one capital letter",

        Needs:
        - Styling - replace TailwindCSS
        - More validation?
        - Check for active sessions?
    */

    const { register, handleSubmit, formState } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (formData) => {
        onSuccess(formData);
    };

    const { errors } = formState;

    return (
        <Box>
            <Box className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <InputLabel
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Email address
                        </InputLabel>
                        <Box className="mt-2">
                            <TextField
                                id="email"
                                autoComplete="email"
                                size="small"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email is required",
                                    },
                                    validate: {
                                        isValidEmail: (value) =>
                                        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                                            value
                                        ) || "Email is not valid",
                                    },
                                })}
                                error={ errors?.email?.message }
                                helperText={ errors?.email?.message }
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Box className="flex items-center justify-between">
                            <InputLabel
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </InputLabel>
                        </Box>
                        <Box className="mt-2">
                            <TextField
                                id="password"
                                type="password"
                                size="small"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required",
                                    },
                                    validate: {
                                        minLength: (value) =>
                                            value.length >= 4 ||
                                            "Password should have more than 4 characters",
                                        isLowerCaseLetter: (value) =>
                                            /[a-z]/.test(value) ||
                                            "Password should have at least one lower case letter",
                                        isContainNumber: (value) =>
                                            /\d/.test(value) ||
                                            "Password should have at least one number",
                                    },
                                })}
                                error={ errors?.password?.message }
                                helperText={ errors?.password?.message }
                            />
                        </Box>
                    </Box>
                    <Box>
                        <Button
                            type="submit"
                            variant='contained'
                            size="small"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default LoginForm;