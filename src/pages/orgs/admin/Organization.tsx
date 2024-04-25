import { useState, useEffect, useContext } from "react";

import { supabase } from "../../../supabaseClient";

import OrgContext from "../../../comps/context/OrgContext";

import OrgEditor from "../../../comps/pages/orgs/admin/OrgEditor";

import { useSnackbar } from "notistack";

const Organization = () => {
  const { enqueueSnackbar } = useSnackbar();
  const organization = useContext(OrgContext);
  const [pendingEdit, setPendingEdit] = useState<OrganizationEdit>({
    id: undefined,
    organization_id: undefined,
    name: undefined,
    url: undefined,
    picture: undefined,
    mission: undefined,
    purpose: undefined,
    benefit: undefined,
    appointment_procedures: undefined,
    uniqueness: undefined,
    meeting_schedule: undefined,
    meeting_days: undefined,
    commitment_level: undefined
  });

  // eslint-disable-next-line
  useEffect(() => {
    const fetchEdits = async () => {
      const { data, error } = await supabase
        .from("organizationedits")
        .select()
        .eq("organization_id", organization.id);

      if (error) {
        return enqueueSnackbar(
          "Error fetching organization edits. Contact it@stuysu.org for support.",
          { variant: "error" }
        );
      }

      if (data.length) {
        setPendingEdit(data[0]);
      }
    };

    fetchEdits();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>Organization Edits</h1>
      <OrgEditor
        organization={organization}
        organizationEdit={pendingEdit}
        setPendingEdit={setPendingEdit}
      />
    </div>
  );
};

export default Organization;
