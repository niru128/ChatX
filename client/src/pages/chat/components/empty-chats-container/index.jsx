import Lottie from "react-lottie"
import { animationDefaultOptions } from "../../../../lib/utils"

const EmptyChatsContainer = () => {
  return (
    <div className="flex-1 md:flex flex-col  items-center justify-center bg-[#1c1d25] hidden duration-1000 transition-all">
      <Lottie
            height={200}
            width={200}
            isClickToPauseDisabled = {true}
            options={animationDefaultOptions}
       />
       <div className="text-opacity-90 flex flex-col gap-5 text-white text-3xl mt-10 items-center text-center lg:text-4xl duration-300 transition-all">


       <h3 className="poppins-medium">
            Hi <span className="text-purple-500"> !</span> Welcome to <span className="text-purple-500">ChatX.</span>
            
       </h3>

       </div>
    </div>
  )
}

export default EmptyChatsContainer
