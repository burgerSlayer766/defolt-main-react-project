import { useEffect } from "react";
import { getCommon } from "../../api/controllers/common-controller";

const MainPage = () => {
    useEffect(() => {
        getCommon()
            .then((response) => {
                console.log(response);
            })
            .catch((e) => console.log(e));
    }, []);

    return <div>
        <h1>Hello React with TypeScript and Webpack!</h1>
    </div>

}

export default MainPage;