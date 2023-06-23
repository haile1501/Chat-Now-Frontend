import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const SearchBox = ({
  handleEnterSearch,
  handleInputChange,
  searchInput,
}: {
  handleEnterSearch: any;
  handleInputChange: any;
  searchInput: string;
}) => {
  return (
    <Box
      sx={{
        color: "#709ce6",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EAF2FE",
        padding: "1rem 1.5rem",
        borderRadius: "1.4rem",
      }}
    >
      <SearchIcon sx={{ mr: "0.6rem", fill: "#709CE6" }} />
      <input
        onFocus={handleEnterSearch}
        onChange={handleInputChange}
        placeholder="Search"
        value={searchInput}
        style={{
          outline: "none",
          border: "none",
          background: "transparent",
          color: "#696969",
          fontSize: "1rem",
          width: "100%",
        }}
      ></input>
      <FilterListIcon
        sx={{
          marginLeft: "auto",
          fill: "#709CE6",
          cursor: "pointer",
        }}
      />
    </Box>
  );
};

export default SearchBox;
