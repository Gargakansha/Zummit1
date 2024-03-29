import React from 'react'

function Page3() {
  return (
      <div className="flex ">
      <div className="flex justify-center items-center ">
        <div className="w-[50%]">
          <img
            className="object-cover mt-8 pr-10  w-[50vw] h-[45vh]"
            src={require("./images/img.jpg")}
          ></img>
        </div>
        <div className="w-[45%] flex flex-col justify-center gap-8">
          <h1 className="text-2xl text-cyan-800 font-semibold">Our Mission</h1>
          <p className="text-xl">
            An online therapy for mental health resource to empower,educate
            andtransform with both group & individual therapy's
          </p>
          <a className="text-end text-xl font-bold text-cyan-800" href="/About">
            Know more
          </a>
        </div>
        =
      </div>
    </div>
  )
}

export default Page3
