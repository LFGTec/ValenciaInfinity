import { CardAlbum } from "../components/features/CardAlbum";
import { useParams } from "react-router-dom";


export default function Album() {
    const { userId } = useParams();

    return (
        <div>
        <CardAlbum userId={userId} />
        </div>
    );
}