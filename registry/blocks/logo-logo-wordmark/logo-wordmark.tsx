import {
  Logo,
  LogoImageDesktop,
  LogoText,
} from "@/components/shared/logo";

const LogoWordmarkExample = () => {
  return (
    <Logo url="#">
      <LogoImageDesktop
        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.png"
        alt="logo"
        title="Kata"
        className="h-7"
      />
      <LogoText>Kata</LogoText>
    </Logo>
  );
};

export default LogoWordmarkExample;
