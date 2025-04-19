import { FunctionComponent } from 'preact';

const Footer: FunctionComponent = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} Daily Quiz & Meme Generator
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Test your knowledge daily and share your results!
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a
              href="#privacy"
              className="text-gray-300 hover:text-white text-sm"
              onClick={(e) => {
                e.preventDefault();
                alert('Privacy policy would open here');
              }}
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-gray-300 hover:text-white text-sm"
              onClick={(e) => {
                e.preventDefault();
                alert('Terms of service would open here');
              }}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 