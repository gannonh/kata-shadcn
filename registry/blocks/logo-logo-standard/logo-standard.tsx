import {
  Logo,
  LogoImageDesktop,
  LogoImageMobile,
} from "@/components/shared/logo";

const LogoStandardExample = () => {
  return (
    <Logo url="#">
      <LogoImageDesktop
        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo-word.png"
        alt="logo"
        title="Kata"
      />
      <LogoImageMobile
        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.png"
        alt="logo"
        title="Kata"
      />
    </Logo>
  );
};

export default LogoStandardExample;
