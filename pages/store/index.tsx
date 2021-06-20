import providers from "./providers";

interface ProvidersComposerProps {
  providers: any[];
  children: React.ReactNode;
}

const ProvidersComposer = (props: ProvidersComposerProps) => {
  return props.providers.reduceRight((children, Parent) => <Parent>{children}</Parent>, props.children);
};

const Provider = ({ children }) => {
  return <ProvidersComposer providers={providers}>{children}</ProvidersComposer>;
};

export default Provider;
