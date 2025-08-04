import BoundingBox from "@/components/BoundingBox";
import { useRef, useState } from "react";

export default function Home() {
     const fileInput = useRef<HTMLInputElement|null>(null);
     const [boxes, setBoxes] = useState<any[]>([]);
     const [imgUrl, setImgUrl] = useState<string>();
   
     const handleUpload = async () => {
       if (!fileInput.current?.files?.[0]) return;
       const file = fileInput.current.files[0];
       setImgUrl(URL.createObjectURL(file));
       const form = new FormData();
       form.append("file", file);
       const res = await fetch("/api/detect", { method: "POST", body: form });
       const { results } = await res.json();
       setBoxes(results);
     };

     return (
          <div>
          <h1>Object Detector</h1>
          <input type="file" accept="image/*" ref={fileInput as any} />
          <button onClick={handleUpload}>Detect</button>
          {imgUrl && <div style={{ position: "relative" }}>
            <img src={imgUrl} />
            {boxes.map((b, i) => (
              <BoundingBox key={i} box={b.box} label={`${b.class} ${b.score.toFixed(2)}`} />
            ))}
          </div>}
        </div>
     )
}