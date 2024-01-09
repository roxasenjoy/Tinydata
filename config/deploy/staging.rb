server "152.228.209.66", :user => "ubuntu", :roles => %{app}

set :branch, "preview"
set :deploy_to, "/var/www/pp-data.tiny-coaching.com"
set :ssh_options, { :forward_agent => true }

namespace :deploy do
    desc 'Build Application'
    task :build do
        on roles(:app) do
            within release_path do
                execute "cd '#{release_path}'; npm install"
                execute "cd '#{release_path}'; ng build --configuration=preproduction"
            end
        end
    end

    after :updated, :build
end
