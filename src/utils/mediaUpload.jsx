import { createClient } from "@supabase/supabase-js";

const url = "https://kliebqkcdztftrqyoaxs.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsaWVicWtjZHp0ZnRycXlvYXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODU4MTUsImV4cCI6MjA2NzM2MTgxNX0.XUpEOQtALtmkzSfr1ey5D6jXVQxYJJtLTIzThVfDA-A"

const Supabase = createClient(url, key);

export default function uploadFile(file) {
    const promise = new Promise((resolve, reject) => {
        if (file == null) {
            reject("No file provided"); 
            return;
        }

        const timeStamp = new Date().getTime();
        const fileName = timeStamp + "_" + file.name;

        Supabase.storage.from("images").upload(fileName, file, {
            cacheControl: "3600",
            upsert: false
        }).then(({ data, error }) => {
            if (error) {
                reject("Error uploading file: " + error.message);
                return;
            }

            // Fixed: Changed 'superbase' to 'Supabase' (typo fix)
            const publicUrl = Supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
            resolve(publicUrl);

        }).catch((err) => {
            reject("Error uploading file: " + err.message);
        });
    });

    return promise;
}