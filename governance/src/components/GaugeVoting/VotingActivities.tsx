import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  Title,
  SecondaryText,
  BaseLink,
  Subtitle,
} from "shared/lib/designSystem";
import MultiselectFilterDropdown, {
  DropdownOption,
} from "shared/lib/components/Common/MultiselectFilterDropdown";
import TableWithFixedHeader from "shared/lib/components/Common/TableWithFixedHeader";
import colors from "shared/lib/designSystem/colors";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import moment from "moment";

const VotingActivityHeader = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  margin-top: 64px;
`;

const ActivityContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius};
  padding: 16px;

  &:not(:first-child) {
    margin-top: 24px;
  }
`;

const ActivityLogoContainer = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  background: ${(props) =>
    props.color ? props.color : colors.background.four};
  border-radius: 100px;
  margin-right: 8px;

  @media (max-width: ${sizes.md}px) {
    margin-right: 24px;
  }
`;

interface VotingActivitiesProps {
  gauges: DropdownOption[];
}

const ACTIVITIES_PER_PAGE = 10;

const VotingActivities: React.FC<VotingActivitiesProps> = ({ gauges }) => {
  console.log({
    gauges,
  });
  const [page, setPage] = useState(1);
  const [filteredActivityGauges, setFilteredActivityGauges] = useState(
    gauges.map(({ value }) => value)
  );
  // TODO: - Loading state
  const [loading, setLoading] = useState(false);
  const animatedLoadingText = useLoadingText();

  const processedActivities = useMemo(() => {
    return [];
  }, []);

  const activities = useMemo(() => {
    if (loading) {
      return (
        <SecondaryText fontSize={16} lineHeight={24}>
          {animatedLoadingText}
        </SecondaryText>
      );
    }

    if (processedActivities.length <= 0) {
      return (
        <SecondaryText fontSize={16} lineHeight={24}>
          You have no transactions
        </SecondaryText>
      );
    }

    return processedActivities
      .slice((page - 1) * ACTIVITIES_PER_PAGE, page * ACTIVITIES_PER_PAGE)
      .map((activity, index) => (
        <ActivityContainer key={index}>
          {/* Logo */}
          <ActivityLogoContainer color={colors.red}>
            {gauges[0].logo}
          </ActivityLogoContainer>

          {/* Title and time */}
          <div className="d-flex flex-column mr-auto">
            <Title>{gauges[0].display}</Title>
            <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
              {moment(123123123, "X").fromNow()}
            </SecondaryText>
          </div>

          {/* Data if any */}
          <div className="d-flex flex-column mr-4">
            {/* {renderActivityData(activity)} */}
          </div>

          {/* External Logo */}
          <BaseLink
            to={"https://google.com"}
            target="_blank"
            rel="noreferrer noopener"
            className="d-none d-md-block"
          >
            {/* <ExternalLink>
              <ExternalLinkIcon color="white" />
            </ExternalLink> */}
          </BaseLink>
        </ActivityContainer>
      ));
  }, [gauges, animatedLoadingText, loading, page, processedActivities]);

  return (
    <>
      <VotingActivityHeader>
        <Title fontSize={18} lineHeight={24} className="mr-4">
          VOTING ACTIVITY
        </Title>
        <MultiselectFilterDropdown
          // @ts-ignore
          mode="compact"
          values={filteredActivityGauges}
          options={gauges}
          title="Gauges"
          onSelect={(values) => setFilteredActivityGauges(values as string[])}
          buttonConfig={{
            background: colors.background.two,
            activeBackground: colors.background.three,
            paddingHorizontal: 8,
            paddingVertical: 8,
            color: `${colors.primaryText}A3`,
          }}
        />
      </VotingActivityHeader>
      <TableWithFixedHeader
        weights={[0.25, 0.25, 0.15, 0.25, 0.25]}
        orientations={["left", "left", "right", "right", "right"]}
        labels={[
          "Voter",
          "Gauge",
          "Voting Power Used",
          "Votes Applied (veRBN)",
          "Total Votes (veRBN)",
        ]}
        data={[
          [
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
          ],
          [
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
          ],
          [
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
          ],
          [
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
            <Title>TESTING</Title>,
          ],
        ]}
        externalLinks={[
          "https://google.com",
          "https://google.com",
          "https://google.com",
          "https://google.com",
        ]}
        logos={[
          gauges[0].logo || <></>,
          gauges[0].logo || <></>,
          gauges[0].logo || <></>,
          gauges[0].logo || <></>,
        ]}
        perPage={ACTIVITIES_PER_PAGE}
        pageController={{
          page,
          setPage,
        }}
      />
    </>
  );
};

export default VotingActivities;
