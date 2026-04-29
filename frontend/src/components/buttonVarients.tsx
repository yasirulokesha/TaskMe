const PrimaryButton = (params:{
    text: string,
    onPress: () => void
}) => {
  return <button className="px-6 py-2 bg-[#2B2D42] hover:bg-[#2b2b42d1] hover:shadow-lg transition duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-[#2b2b42d1] rounded-lg text-white font-medium text-sm" onClick={params.onPress}>
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

export { PrimaryButton, IconButton };
