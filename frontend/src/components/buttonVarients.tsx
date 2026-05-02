const PrimaryButton = (params:{
    text: string,
    onPress: () => void
}) => {
  return <button className="px-7 py-2 bg-[#2B2D42] hover:bg-[#2b2b42d1] hover:shadow-lg transition duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-[#2b2b42d1] rounded-lg text-white font-medium text-sm" onClick={params.onPress}>
    {params.text}
  </button>;
};

const IconButton = (params:{
    text: string,
    icon: React.ReactNode,
    onPress: () => void
}) => {
  return <button className="flex flex-row px-6 py-2 bg-[#2B2D42] hover:bg-[#2b2b42d1] hover:shadow-lg transition duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-[#2b2b42d1] rounded-lg text-white font-medium text-sm" onClick={params.onPress}>
    {params.text}&nbsp;&nbsp;{params.icon}
  </button>;
};

const OutlinedButton = (params:{
    text: string,
    onPress: () => void
}) => {
  return <button className="px-7 py-1 text-[#E04747] border-[#E04747] border-2 hover:bg-[#E04747] hover:text-white transition duration-200 focus:outline-2 outline-offset-2 outline-[#E04747] rounded-lg font-bold text-sm" onClick={params.onPress}>
    {params.text}
  </button>;
};

export { PrimaryButton, IconButton, OutlinedButton };
