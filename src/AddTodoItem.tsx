import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
    const { summary, notes, tags } = values;
    const asyncWrapper = async () => {
      const id = await db.todoItems.add({
        summary,
        notes,
        created_at: new Date(),
        tags: tags.split(","),
      });
      navigate("/history");
    };
    asyncWrapper().catch(console.error);
  };

  return (
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
        <FormErrorMessage>{errors.notes?.message?.toString()}</FormErrorMessage>
      </FormControl>
      {/* TODO: want: multi-select with autocomplete for existing or add new */}
      <FormControl isInvalid={Boolean(errors.notes)}>
        <FormLabel htmlFor="tags">Tags</FormLabel>
        <Input id="tags" placeholder="tags" {...register("tags")} />
        <FormErrorMessage>{errors.tags?.message?.toString()}</FormErrorMessage>
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
  );
}
