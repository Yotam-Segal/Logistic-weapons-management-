import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAtom } from 'jotai';

import { locationAtom } from '../../../shared/stores/session';
import { MOCK_LOCATIONS } from '../../utils/mockLocations';

import styles from './locationSelector.module.scss';

// * Sentinel value used by the empty MenuItem; picking it clears locationAtom.
const EMPTY_VALUE: string = '';
const LABEL_ID: string = 'location-selector-label';
const PLACEHOLDER_LABEL: string = 'בחר מיקום';

// * Location picker bound to the global locationAtom (Req 2.1, 2.3).
// * Reads and writes the selected location id; a dedicated empty option lets
// * the user clear the selection, which resets the atom to null so downstream
// * queries can skip fetching until a location is chosen again.
// ? Uses MOCK_LOCATIONS for now; a future useLocations() hook will replace this
// ? with a server-backed list without changing this component's surface.
const LocationSelector = (): JSX.Element => {
    const [locationId, setLocationId] = useAtom(locationAtom);

    const handleChange = (event: SelectChangeEvent<string>): void => {
        const nextValue: string = event.target.value;
        setLocationId(nextValue === EMPTY_VALUE ? null : nextValue);
    };

    return (
        <FormControl className={styles.root} size="small">
            <InputLabel id={LABEL_ID}>{PLACEHOLDER_LABEL}</InputLabel>
            <Select
                labelId={LABEL_ID}
                value={locationId ?? EMPTY_VALUE}
                label={PLACEHOLDER_LABEL}
                onChange={handleChange}
            >
                <MenuItem value={EMPTY_VALUE}>
                    <em>{PLACEHOLDER_LABEL}</em>
                </MenuItem>
                {MOCK_LOCATIONS.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                        {location.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LocationSelector;
