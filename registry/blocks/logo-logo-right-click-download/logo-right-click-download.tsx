import {
  Logo,
  LogoBrandDownload,
  LogoImageDesktop,
  LogoImageMobile,
} from "@/components/shadcnblocks/logo";

const LogoRightClickDownloadExample = () => {
  return (
    <LogoBrandDownload
      files={[
        {
          name: "shadcnblocks-logo-word.svg",
          path: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo-word.svg",
          format: "svg",
        },
        {
          name: "shadcnblocks-logo-word.png",
          path: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo-word.png",
          format: "png",
        },
      ]}
    >
      <Logo url="https://shadcnblocks.com">
        <LogoImageDesktop
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo-word.png"
          alt="logo"
          title="Shadcnblocks.com"
        />
        <LogoImageMobile
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.png"
          alt="logo"
          title="Shadcnblocks.com"
        />
      </Logo>
    </LogoBrandDownload>
  );
};

export default LogoRightClickDownloadExample;
