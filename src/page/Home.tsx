import ReactEmbedGist from 'react-embed-gist';

function Home() {
  return (
    <div className="container mx-auto">
      <ReactEmbedGist
        gist='0x50Fc/4f4746a4263a78fb7ac65e57004c0d47'
        wrapperClass="gist__bash"
        loadingClass="mb-1 text-md font-medium text-gray-900 dark:text-white"
        titleClass="gist__title"
        errorClass="mb-1 text-md font-medium text-gray-900 dark:text-white"
        contentClass="gist__content"
        file="README.md"
      />
    </div>
  );
}

export default Home;
