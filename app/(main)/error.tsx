"use client";
import { Button, makeStyles, Text, tokens } from "@fluentui/react-components";
import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const classes = useClasses();
  return (
    <div className={classes.errorContainer}>
      <Text className="text-2xl font-bold mb-4 text-red-600">出错了</Text>
      <pre className="bg-gray-100 text-red-700 p-4 rounded max-w-xl overflow-x-auto mb-4 whitespace-pre-wrap">
        {error.message}
      </pre>
      <Button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => reset()}
      >
        重试
      </Button>
    </div>
  );
}

const useClasses = makeStyles({
  errorContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "5px",
    color: "#721c24",
  },
  errorMessage: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  retryButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
  },
});
