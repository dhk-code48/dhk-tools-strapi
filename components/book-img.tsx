import Image from "next/image";
import React, { FC, useEffect, useState } from "react";

const BookImage: FC<{ url: string }> = ({ url }) => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [url]);
  return (
    <Image
      src={error ? "/book.png" : "/img/" + url}
      onError={() => setError(true)}
      alt="Book Banner"
      width={error ? 50 : 100}
      height={error ? 50 : 400}
    />
  );
};

export default BookImage;
