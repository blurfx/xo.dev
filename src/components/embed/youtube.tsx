const Youtube = ({ url }: { url: string }) => {
  return (
    <iframe
      width='560'
      height='315'
      src={url}
      title='YouTube video player'
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
    ></iframe>
  );
};

export default Youtube;
