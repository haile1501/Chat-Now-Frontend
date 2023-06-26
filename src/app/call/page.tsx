import dynamic from "next/dynamic";

const Call = dynamic(() => import("../../components/dashboard/calls/Call"), {
  ssr: false,
});

const CallPage = () => {
  return (
    <div>
      <Call />
    </div>
  );
};

export default CallPage;
