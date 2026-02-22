import {
  Logo,
  LogoImageDesktop,
  LogoText,
} from "@/components/shadcnblocks/logo";

const LogoWordmarkExample = () => {
  return (
    <Logo url="https://shadcnblocks.com">
      <LogoImageDesktop
        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.png"
        alt="logo"
        title="Shadcnblocks.com"
        className="h-7"
      />
      <LogoText>Shadcnblocks</LogoText>
    </Logo>
  );
};

export default LogoWordmarkExample;
