import { Box, TextField, Typography, Button, Card } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const Announcements = () => {
    let [content, setContent] = useState("");
    let { enqueueSnackbar } = useSnackbar();
    let [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const { data, error } = await supabase
                .from("announcements")
                .select("*");

            if (error || !data) {
                enqueueSnackbar(
                    "Failed to load announcements. Contact it@stuysu.org for support.",
                    { variant: "error" },
                );
                return;
            }

            setAnnouncements(data as Announcement[]);
        };

        fetchAnnouncements();
    }, [enqueueSnackbar]);

    const createAnnouncement = async () => {
        if (content === "") {
            enqueueSnackbar("Announcement cannot be empty.", {
                variant: "error",
            });
            return;
        }

        const { data, error } = await supabase
            .from("announcements")
            .insert({ content })
            .select("*")
            .limit(1)
            .single();

        if (error || !data) {
            enqueueSnackbar(
                "Failed to create announcement. Contact it@stuysu.org for support.",
                { variant: "error" },
            );
            return;
        }

        setContent("");
        setAnnouncements((prev) => [data, ...prev]);
    };

    const deleteAnnouncement = async (id: number) => {
        const { error } = await supabase
            .from("announcements")
            .delete()
            .eq("id", id);

        if (error) {
            enqueueSnackbar(
                "Failed to delete announcement. Contact it@stuysu.org for support.",
                { variant: "error" },
            );
            return;
        }

        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        enqueueSnackbar("Announcement deleted.", { variant: "success" });
    };

    return (
        <Box>
            <Typography variant="h1" width="100%" align="center">
                Announcements
            </Typography>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
            >
                <Typography variant="h4" width="100%" align="center">
                    Create Announcement
                </Typography>
                <Box sx={{ width: "500px" }}>
                    <TextField
                        sx={{ width: "100%" }}
                        multiline
                        rows={3}
                        value={content}
                        label="Content"
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.ctrlKey) {
                                e.preventDefault();
                                createAnnouncement();
                            }
                        }}
                    />
                    <Button
                        sx={{ width: "100%", marginTop: "10px" }}
                        variant="contained"
                        onClick={createAnnouncement}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    marginTop: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {announcements.map((announcement, i) => {
                    return (
                        <Box
                            key={i}
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                marginTop: "10px",
                            }}
                        >
                            <Card
                                sx={{
                                    maxWidth: "600px",
                                    width: "100%",
                                    display: "flex",
                                    padding: "10px",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        width: "80%",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {announcement.content}
                                </Typography>
                                <Button
                                    onClick={() =>
                                        deleteAnnouncement(announcement.id)
                                    }
                                    sx={{
                                        width: "15%",
                                        marginLeft: "20px",
                                        height: "40px",
                                    }}
                                    variant="contained"
                                >
                                    Delete
                                </Button>
                            </Card>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default Announcements;
