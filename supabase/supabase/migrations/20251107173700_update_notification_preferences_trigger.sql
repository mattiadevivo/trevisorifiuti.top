CREATE OR REPLACE FUNCTION tvtrash.call_edge_function_on_notification_preferences_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' 
AS $$
BEGIN
    -- Make the HTTP POST request to the edge function
    perform net.http_post(
        url:= (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/send-notification',
        headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'secret_key'),
            'apikey', (select decrypted_secret from vault.decrypted_secrets where name = 'secret_key')
        ),
        body:=jsonb_build_object(
            'user_id', new.user_id
        )
    ) AS request_id;
    RETURN new;
END $$;
GRANT EXECUTE ON FUNCTION tvtrash.call_edge_function_on_notification_preferences_change TO service_role;

-- Create the trigger
CREATE OR REPLACE TRIGGER send_notification_on_notification_preferences_change
AFTER INSERT OR UPDATE ON tvtrash.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION tvtrash.call_edge_function_on_notification_preferences_change();