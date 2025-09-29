import { useEffect, useState } from 'react';
import useSeasons from '../../control/stores/useSeasons';
import { getSeasons } from '../../control/api/get-brands-seasons';
import { Season } from '../../control/types/product.schemas';
import { getStylesWithAttributesToEdit } from '../../export/api/get-attributeList';
import { CSVLink } from 'react-csv';

const ExportForm = () => {
  const { seasons, setAllSeasons } = useSeasons();
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [stylesWithAttributesToEdit, setStylesWithAttributesToEdit] = useState(
    []
  );
  const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');

  useEffect(() => {
    getSeasons().then((fetchedSeasons: Season[]) => {
      setAllSeasons(fetchedSeasons);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    season: number
  ) => {
    e.preventDefault();

    try {
      const fetchedStyles = await getStylesWithAttributesToEdit(season);
      setStylesWithAttributesToEdit(fetchedStyles);
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  };

  return (
    <div className="export-form">
      <form
        onSubmit={(e) => {
          handleSubmit(e, selectedSeason);
        }}
      >
        <select
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          value={selectedSeason}
        >
          <option value="">Select Season</option>
          {seasons.map((season, index: number) => (
            <option key={`${season}-${index}`} value={season.season_name}>
              {season.season_name}
            </option>
          ))}
        </select>
        <button disabled={!selectedSeason} type="submit">
          Fetch Styles
        </button>
      </form>
      {stylesWithAttributesToEdit.length > 0 && (
        <CSVLink
          data={stylesWithAttributesToEdit}
          filename={`at-attributes-export${currentDate}.csv`}
          separator={';'}
        >
          Download
        </CSVLink>
      )}
    </div>
  );
};
export default ExportForm;
