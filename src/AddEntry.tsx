import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { db } from "./db";

export default function HookForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    const { summary, notes, todo_id } = values;
    const asyncWrapper = async () => {
      const id = await db.entries.add({
        summary,
        notes,
        timestamp: new Date(),
        todo_id,
      });
      navigate("/history");
    };
    asyncWrapper().catch(console.error);
  };

  return (
    <>
      {/* TODO: how to tweak title size */}
      <Text size={""}>Add Sup</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.summary)}>
          <FormLabel htmlFor="summary">Summary</FormLabel>
          <Input
            id="summary"
            placeholder="summary"
            {...register("summary", {
              required: "Summary is required",
              minLength: { value: 4, message: "Minimum length should be 4" },
            })}
          />
          <FormErrorMessage>
            {errors.summary?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.notes)}>
          <FormLabel htmlFor="notes">Notes</FormLabel>
          <Input id="notes" placeholder="notes" {...register("notes")} />
          <FormErrorMessage>
            {errors.notes?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.notes)}>
          <FormLabel htmlFor="todo_id">Todo ID</FormLabel>
          <Input id="todo_id" placeholder="todo_id" {...register("todo_id")} />
          <FormErrorMessage>
            {errors.notes?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </form>
    </>
  );
}
