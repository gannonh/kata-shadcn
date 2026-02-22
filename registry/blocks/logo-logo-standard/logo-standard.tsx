import {
  Logo,
  LogoImageDesktop,
  LogoImageMobile,
} from "@/components/shadcnblocks/logo";

const LogoStandardExample = () => {
  return (
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
  );
};

export default LogoStandardExample;
