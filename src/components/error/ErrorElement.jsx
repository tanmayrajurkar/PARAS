import {useRouteError} from "react-router-dom"
const ErrorElement = () => {
  const error = useRouteError();
  return (
    <div className="mx-auto">
    <h4 className="font-bold text-4xl text-gray-200">There was an error...</h4>
    </div>
  )
}

export default ErrorElement