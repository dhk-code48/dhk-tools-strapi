"use server";
// Import necessary modules
// import fetch from "node-fetch"; // For making HTTP requests
import { promises as fsPromises } from "fs"; // For file system operations

const { writeFile } = fsPromises;

// Function to save image from URL to public folder
export async function saveImageToPublic(imageUrl: string, imageName: string) {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the image buffer to the public folder
    await writeFile(`public/img/${imageName}`, buffer);
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Record Created !" };
}
