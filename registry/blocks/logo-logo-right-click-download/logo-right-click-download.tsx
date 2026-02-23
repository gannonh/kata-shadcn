import {
  Logo,
  LogoBrandDownload,
  LogoImageDesktop,
  LogoImageMobile,
} from "@/components/shared/logo";

const LogoRightClickDownloadExample = () => {
  return (
    <LogoBrandDownload
      files={[
        {
          name: "Kata-logo-word.svg",
          path: "https://deifkwefumgah.cloudfront.net/Kata/block/logos/Kata-logo-word.svg",
          format: "svg",
        },
        {
          name: "Kata-logo-word.png",
          path: "https://deifkwefumgah.cloudfront.net/Kata/block/logos/Kata-logo-word.png",
          format: "png",
        },
      ]}
    >
      <Logo url="#">
        <LogoImageDesktop
          src="https://deifkwefumgah.cloudfront.net/Kata/block/logos/Kata-logo-word.png"
          alt="logo"
          title="Kata"
        />
        <LogoImageMobile
          src="https://deifkwefumgah.cloudfront.net/Kata/block/logos/Kata-logo.png"
          alt="logo"
          title="Kata"
        />
      </Logo>
    </LogoBrandDownload>
  );
};

export default LogoRightClickDownloadExample;
