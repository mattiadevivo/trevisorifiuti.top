CREATE OR REPLACE FUNCTION tvtrash.send_notification()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' 
AS $$
BEGIN
    -- Make the HTTP POST request to the edge function
    perform net.http_post(
        url:= (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/send-notification',
        headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'secret_key')
        ),
        body:=jsonb_build_object(
            'user_id', new.user_id
        )
    ) AS request_id;
    RETURN new;
END $$;

-- Create the trigger
CREATE OR REPLACE TRIGGER send_notification_on_user_preference_change
AFTER INSERT ON tvtrash.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION tvtrash.send_notification();