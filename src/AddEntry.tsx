import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { db } from "./db";

export default function HookForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    const asyncWrapper = async () => {
      const id = await db.entries.add({
        summary: values.summary,
        notes: "",
        timestamp: new Date(),
      });
      setIsSubmitted(true);
      console.log("submit!");
    };
    asyncWrapper().catch(console.error);

    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     alert(JSON.stringify(values, null, 2));
    //     resolve(undefined);
    //   }, 1000);
    // });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name !== undefined}>
        <FormLabel htmlFor="summary">Summary</FormLabel>
        <Input
          id="summary"
          placeholder="summary"
          {...register("summary", {
            required: "This is required",
            minLength: { value: 4, message: "Minimum length should be 4" },
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name?.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
}
