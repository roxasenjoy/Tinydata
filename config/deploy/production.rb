server "141.94.173.120", :user => "ubuntu", :roles => %{app}

set :branch, "master"
set :deploy_to, "/var/www/data.tiny-coaching.com"
set :ssh_options, { :forward_agent => true }

namespace :deploy do
    desc 'Build Application'
    task :build do
        on roles(:app) do
            within release_path do
                execute "cd '#{release_path}'; npm install"
                execute "cd '#{release_path}'; ng build --configuration=production"
            end
        end
    end

    after :updated, :build
end
